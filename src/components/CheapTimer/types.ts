export interface ITimeOffset {
    days?: number;
    hours?: number;
    milliseconds?: number;
    minutes?: number;
    months?: number;
    seconds?: number;
    years?: number;
}

export interface ITimeFlag {
    days?: boolean;
    hours?: boolean;
    milliseconds?: boolean;
    minutes?: boolean;
    months?: boolean;
    seconds?: boolean;
    years?: boolean;
}

export type IRequiredTimeOffset = Required<
    Pick<ITimeOffset, "days" | "hours" | "minutes" | "seconds">
>;
