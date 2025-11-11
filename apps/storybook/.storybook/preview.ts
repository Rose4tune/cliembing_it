import type { Preview } from "@storybook/react";
import "../../web/app/globals.css";

const preview: Preview = {
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    actions: { argTypesRegex: "^on[A-Z].*" },
    docs: { autodocs: "tag" }, // CSF + Autodocs
  },
};

export default preview;
