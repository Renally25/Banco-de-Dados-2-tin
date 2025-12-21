import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { CodDiario } = params;

  const result = await pool.query(
    "SELECT * FROM Usuario WHERE CodDiario = $1",
    [CodDiario]
  );

  return NextResponse.json(result.rows[0]);
}