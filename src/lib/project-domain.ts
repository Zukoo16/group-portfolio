/** A project lives on a third-level DNS name, e.g. student.vercel.app. */
export function isThirdLevelProjectUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const labels = url.hostname.replace(/\.$/, "").split(".");
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username && !url.password && !url.port &&
      labels.length === 3 &&
      labels.every((label) => /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(label)) &&
      /^[a-z]{2,63}$/i.test(labels[2])
    );
  } catch {
    return false;
  }
}
