import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(requisicao) {

    try {

        const { CodEndereco, CodUsuario, cep, estado, cidade, bairro, rua, numero} = await requisicao.json();

        if ( !CodEndereco || !CodUsuario || !cep ||!estado || !cidade || !bairro || !rua || numero == null) {
            return NextResponse.json(
                { error: "Informações em branco." },
                { status: 400 }
            );
        }

         await pool.query(
            `INSERT INTO Endereco ( CodEndereco, CodUsuario, cep, estado, cidade, bairro, rua, numero)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [ CodEndereco, CodUsuario, cep, estado, cidade, bairro, rua, numero]
        );

        return NextResponse.json({ message: "Endereco cadastrado com sucesso!" }, { status: 201 })

    } catch (error) {
          if (error.code === "23505") {
            return NextResponse.json(
            { error: "CodEndereco já existe." },
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

        const result = await pool.query(`SELECT * FROM Endereco ORDER BY CodEndereco ASC;`);
        return NextResponse.json(result.rows);

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(requisicao) {

    try {
        const { searchParams } = new URL(requisicao.url);
        const id = searchParams.get("CodEndereco");

        if (!id) {
            return NextResponse.json(
                { error: "Informe o CodEndereco para deletar." },
                { status: 400 }
            );
        }

            await pool.query(
            `DELETE FROM Endereco WHERE CodEndereco = $1`,
            [id]
        );

        return NextResponse.json({
            message: "Endereco deletado com sucesso!"
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}