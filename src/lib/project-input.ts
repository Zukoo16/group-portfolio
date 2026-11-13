export type ProjectInput = {
  title: string;
  description: string;
  techStack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
};

type ProjectInputResult =
  | { data: ProjectInput; error?: never }
  | { data?: never; error: string };

function optionalHttpUrl(value: unknown): string | null | undefined {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return undefined;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function parseProjectInput(input: unknown): ProjectInputResult {
  if (!input || typeof input !== "object") {
    return { error: "Жоба деректері дұрыс емес." };
  }

  const values = input as Record<string, unknown>;
  const title = typeof values.title === "string" ? values.title.trim() : "";
  const description =
    typeof values.description === "string" ? values.description.trim() : "";
  const rawTechStack = values.techStack;
  const techStack = Array.isArray(rawTechStack)
    ? rawTechStack
    : typeof rawTechStack === "string"
      ? rawTechStack.split(",")
      : [];
  const liveUrl = optionalHttpUrl(values.liveUrl);
  const githubUrl = optionalHttpUrl(values.githubUrl);

  if (!title || title.length > 120) {
    return { error: "Жоба атауы 1-120 таңба аралығында болуы керек." };
  }
  if (!description || description.length > 10000) {
    return { error: "Сипаттама 1-10000 таңба аралығында болуы керек." };
  }
  if (
    techStack.length < 1 ||
    techStack.length > 20 ||
    techStack.some(
      (item) => typeof item !== "string" || item.trim().length === 0 || item.length > 40,
    )
  ) {
    return { error: "1-20 технологияны үтір арқылы енгізіңіз." };
  }
  if (liveUrl === undefined || githubUrl === undefined) {
    return { error: "Сілтемелер http:// немесе https:// арқылы басталуы керек." };
  }

  return {
    data: {
      title,
      description,
      techStack: techStack.map((item) => (item as string).trim()),
      liveUrl,
      githubUrl,
    },
  };
}
