import { NextResponse } from "next/server";
import { updateTask, deleteTask } from "../../../../lib/db";

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const updated = updateTask(id, body);
  if (!updated) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_, { params }) {
  const id = parseInt(params.id);
  deleteTask(id);
  return NextResponse.json({ ok: true });
}
