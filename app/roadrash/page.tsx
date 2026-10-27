import { redirect } from "next/navigation";

/**
 * The Road Rash tribute is a self-contained static build in `public/roadrash`
 * (plain HTML/CSS/ES modules, no bundler, no dependencies).
 *
 * This route exists only as a friendly URL, so it hands the browser straight
 * over to the static page instead of wrapping it in an iframe — that way the
 * canvas gets real keyboard focus and the game owns the whole tab.
 */
export default function RoadRashPage() {
  redirect("/roadrash/index.html");
}
