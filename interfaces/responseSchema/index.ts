export * from "./me";
export * from "./cash";
export * from "./user";
export * from "./order";
export * from "./export";
export * from "./report";
export * from "./partner";
export * from "./setting";
export * from "./product";
export * from "./discount";
export * from "./customer";
export * from "./warehouse";
export * from "./permission";

export * from "./utils";

type responseSchema<T> = {
  next: string | null;
  previous: string | null;
  results: T[];
  count: number;
};

export type { responseSchema };
