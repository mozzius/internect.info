import {
  SiBluesky as BlueskyIcon,
  SiGithub as GithubIcon,
} from "@icons-pack/react-simple-icons";

export function Footer() {
  return (
    <footer className="border-t py-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
        <p className="text-muted-foreground text-center text-sm">
          &copy; {new Date().getFullYear()} internect.info
        </p>
        <div className="flex items-center gap-4">
          {/* <a
            href="#"
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            About
          </a> */}
          <a
            href="https://bsky.app/profile/did:plc:p2cp5gopk7mgjegy6wadk3ep"
            className="text-muted-foreground hover:text-foreground text-sm"
            target="_blank"
            rel="noreferrer"
          >
            <BlueskyIcon className="size-4" />
          </a>
          <a
            href="https://github.com/mozzius/internect.info"
            className="text-muted-foreground hover:text-foreground text-sm"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
