import type { Question } from "inquirer";

export type Args = string[];

type BaseOptions = {
  project: string | null;
  install: boolean | null;
  dev: boolean;
  externalExtension: ExternalExtension | ExternalExtensionNameDev | null;
};

export type ExternalExtension = {
  repository: string;
  branch?: string | null;
};

export type ExternalExtensionNameDev = string;

export type RawOptions = BaseOptions & {
  solidityFramework: SolidityFramework | "none" | null;
  help: boolean;
};

type MergedOptions = BaseOptions & {
  extensions: Extension[];
};

type NonNullableMergedOptions = {
  [Prop in keyof Omit<MergedOptions, "externalExtension">]: NonNullable<MergedOptions[Prop]>;
} & {
  externalExtension: RawOptions["externalExtension"];
};

export type Options = NonNullableMergedOptions;

export type SolidityFramework = "hardhat" | "foundry";

export type Extension = SolidityFramework;

type NullExtension = null;
export type ExtensionOrNull = Extension | NullExtension;
// corresponds to inquirer question types:
//  - multi-select -> checkbox
//  - single-select -> list
type QuestionType = "multi-select" | "single-select";
interface ExtensionQuestion<T extends ExtensionOrNull[] = ExtensionOrNull[]> {
  type: QuestionType;
  extensions: T;
  name: string;
  message: Question["message"];
  default?: T[number];
}

export const isExtension = (item: ExtensionOrNull): item is Extension => item !== null;

/**
 * This function makes sure that the `T` generic type is narrowed down to
 * whatever `extensions` are passed in the question prop. That way we can type
 * check the `default` prop is not using any valid extension, but only one
 * already provided in the `extensions` prop.
 *
 * Questions can be created without this function, just using a normal object,
 * but `default` type will be any valid Extension.
 */
export const typedQuestion = <T extends ExtensionOrNull[]>(question: ExtensionQuestion<T>) => question;
export type Config = {
  questions: ExtensionQuestion[];
};

export const isDefined = <T>(item: T | undefined | null): item is T => item !== undefined && item !== null;

export type ExtensionDescriptor = {
  name: string;
  value: Extension;
  path: string;
};

export type ExtensionDict = {
  [extension in Extension]: ExtensionDescriptor;
};

export type TemplateDescriptor = {
  path: string;
  fileUrl: string;
  relativePath: string;
  source: string;
};
