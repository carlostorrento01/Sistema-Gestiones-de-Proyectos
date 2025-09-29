import { NextResponse } from "next/server";
import { getTasks, createTask } from "../../../lib/db";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");
  const list = getTasks(projectId ? parseInt(projectId) : undefined);
  return NextResponse.json(list);
}

export async function POST(req) {
  const body = await req.json();
  if (!body.title || !body.projectId) {
    return NextResponse.json({ error: "title y projectId requeridos" }, { status: 400 });
  }
  const created = createTask({
    title: body.title,
    projectId: parseInt(body.projectId),
    assignedTo: body.assignedTo || "",
    status: body.status || "todo",
  });
  return NextResponse.json(created, { status: 201 });
}
