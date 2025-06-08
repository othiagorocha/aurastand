import { getAllProjects } from "@/actions/project-actions";
import { ProjectList } from "@/features/projects/components/project-list";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-900'>Projetos</h1>
        <Link href='/projects/new' className='bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700'>
          Novo Projeto
        </Link>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
