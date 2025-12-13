import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {

    try {

        const { CodConsulta, dataConsulta, horaConsulta, status, observacoes, CodUsuario } = await requisicao.json();

        if (!CodConsulta || !dataConsulta || !horaConsulta || !status || !CodUsuario) {
            return NextResponse.json(
                { error: "Informações em branco." },
                { status: 400 }
            );
        }

         await pool.query(
            `INSERT INTO Consulta (CodConsulta, dataConsulta, horaConsulta, status, observacoes, CodUsuario)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            [CodConsulta, dataConsulta, horaConsulta, status, observacoes, CodUsuario]
        );

        return NextResponse.json({ message: "Consulta agendada com sucesso!" }, { status: 201 })

    } catch (error) {
        if (error.code === "23505") {
            return NextResponse.json(
            { error: "CodConsulta já existe." },
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

        const result = await pool.query(`SELECT * FROM Consulta ORDER BY CodConsulta ASC;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(requisicao) {

    try {
        const { searchParams } = new URL(requisicao.url);
        const id = searchParams.get("CodConsulta");

        if (!id) {
            return NextResponse.json(
                { error: "Informe o CodConsulta para deletar." },
                { status: 400 }
            );
        }

            await pool.query(
            `DELETE FROM Consulta WHERE CodConsulta = $1`,
            [id]
        );

        return NextResponse.json({
            message: "Consulta deletada com sucesso!"
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}