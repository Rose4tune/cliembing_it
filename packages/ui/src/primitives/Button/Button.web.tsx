import type { ComponentProps } from "react";
import { Button as ShadcnButton, buttonVariants } from "@pkg/ui-web";

export { buttonVariants };

export type ButtonProps = ComponentProps<typeof ShadcnButton>;

export const Button = ShadcnButton;
