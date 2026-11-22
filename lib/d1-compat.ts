import { createClient, type Client, type InValue } from "@libsql/client";

/**
 * libSQL / Turso client singleton. SQLite-compatible, so the raw SQLite SQL the
 * app already uses (INSERT OR IGNORE, datetime("now", ...), etc.) runs unchanged.
 */
let client: Client | null = null;

export function getLibsqlClient(): Client {
  if (client) return client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Create a Turso database and set TURSO_DATABASE_URL (and TURSO_AUTH_TOKEN for remote databases)."
    );
  }
  client = createClient({ url, authToken });
  return client;
}

type Row = Record<string, unknown>;

function rowToObject(columns: string[], row: unknown[]): Row {
  const obj: Row = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = (row as unknown[])[i];
  }
  return obj;
}

/**
 * Minimal re-implementation of the Cloudflare D1 prepared-statement surface the
 * app depends on: prepare().bind().all()/.first()/.run() and db.batch().
 */
export class PreparedStatement {
  constructor(
    private readonly sql: string,
    private readonly args: InValue[] = []
  ) {}

  bind(...args: unknown[]): PreparedStatement {
    return new PreparedStatement(this.sql, args as InValue[]);
  }

  async all<T = Row>(): Promise<{ results: T[]; success: true; meta: Record<string, unknown> }> {
    const rs = await getLibsqlClient().execute({ sql: this.sql, args: this.args });
    return {
      results: rs.rows.map((r) => rowToObject(rs.columns, r as unknown as unknown[])) as T[],
      success: true,
      meta: {},
    };
  }

  async first<T = Row>(): Promise<T | null> {
    const rs = await getLibsqlClient().execute({ sql: this.sql, args: this.args });
    if (rs.rows.length === 0) return null;
    return rowToObject(rs.columns, rs.rows[0] as unknown as unknown[]) as T;
  }

  async run(): Promise<{ success: true; meta: { changes: number; last_row_id: number } }> {
    const rs = await getLibsqlClient().execute({ sql: this.sql, args: this.args });
    return {
      success: true,
      meta: { changes: rs.rowsAffected, last_row_id: Number(rs.lastInsertRowid ?? 0) },
    };
  }

  /** @internal used by batch() */
  toRaw() {
    return { sql: this.sql, args: this.args };
  }
}

export interface D1Database {
  prepare(sql: string): PreparedStatement;
  batch(statements: PreparedStatement[]): Promise<unknown[]>;
}

export function getD1(): D1Database {
  return {
    prepare(sql: string) {
      return new PreparedStatement(sql);
    },
    async batch(statements: PreparedStatement[]) {
      return getLibsqlClient().batch(
        statements.map((s) => s.toRaw()),
        "write"
      );
    },
  };
}
