import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { CodUsuario } = params;

  const result = await pool.query(
    "SELECT * FROM Usuario WHERE CodUsuario = $1",
    [CodUsuario]
  );

  return NextResponse.json(result.rows[0]);
}
