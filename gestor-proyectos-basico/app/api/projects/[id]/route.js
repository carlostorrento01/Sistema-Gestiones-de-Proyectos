import { NextResponse } from "next/server";
import { getProjectById, updateProject, deleteProject } from "../../../../lib/db";

export async function GET(_, { params }) {
  const id = parseInt(params.id);
  const p = getProjectById(id);
  if (!p) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
  return NextResponse.json(p);
}

export async function PUT(req, { params }) {
  const id = parseInt(params.id);
  const body = await req.json();
  const updated = updateProject(id, body);
  if (!updated) return NextResponse.json({ error: "no encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_, { params }) {
  const id = parseInt(params.id);
  deleteProject(id);
  return NextResponse.json({ ok: true });
}
