export type Tag = keyof HTMLElementTagNameMap;
export type Element<T extends Tag> = HTMLElementTagNameMap[T];

export type Component<Props extends Record<string, unknown> = {}> = (props: Props) => Element<Tag>[];
