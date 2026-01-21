import { Composition, Folder } from "remotion";
import { HelloWorld, myCompSchema } from "./compositions/shared-templates/HelloWorld";
import { Logo, myCompSchema2 } from "./compositions/shared-templates/HelloWorld/Logo";

// Each <Composition> is an entry in the sidebar!
// Organized by project for easy multi-project management

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ========== TheBecomingApp Videos ========== */}
      <Folder name="BecomingApp">
        {/* Add your BecomingApp compositions here */}
      </Folder>

      {/* ========== Shared Templates ========== */}
      <Folder name="Templates">
        <Composition
          id="HelloWorld"
          component={HelloWorld}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={myCompSchema}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />

        <Composition
          id="OnlyLogo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          schema={myCompSchema2}
          defaultProps={{
            logoColor1: "#91dAE2" as const,
            logoColor2: "#86A8E7" as const,
          }}
        />
      </Folder>
    </>
  );
};
