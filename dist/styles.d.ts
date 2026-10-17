/**
 * Every rule is a single class selector (plus state), so page-level element rules like
 * `button {}` or `h2 {}` cannot leak in, and your own `.cm-*` rules loaded later still win.
 * Theme everything through the --cm-* custom properties.
 */
export declare const css: string;
