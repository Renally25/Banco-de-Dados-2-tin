import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {

    try {

        const { CodDiario, dataDiario, descricao, humor, notaTreino } = await requisicao.json();

        if (!CodDiario || !dataDiario || !humor || notaTreino == null) {
            return NextResponse.json(
                { error: "Informações em branco." },
                { status: 400 }
            );
        }

         await pool.query(
            `INSERT INTO Diario (CodDiario, dataDiario, descricao, humor, notaTreino)
            VALUES ($1, $2, $3, $4, $5)`,
            [CodDiario, dataDiario, descricao, humor, notaTreino]
        );

        return NextResponse.json({ message: "Diario registrado com sucesso!" }, { status: 201 })

    } catch (error) {
        if (error.code === "23505") {
            return NextResponse.json(
            { error: "CodDiario já existe." },
            { status: 409 }
            );
         }

        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {

    try {

        const result = await pool.query(`SELECT * FROM Diario ORDER BY CodDiario ASC;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(requisicao) {

    try {
        const { searchParams } = new URL(requisicao.url);
        const id = searchParams.get("CodDiario");

        if (!id) {
            return NextResponse.json(
                { error: "Informe o CodDiario para deletar." },
                { status: 400 }
            );
        }

            await pool.query(
            `DELETE FROM Diario WHERE CodDiario = $1`,
            [id]
        );

        return NextResponse.json({
            message: "Diario deletado com sucesso!"
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}