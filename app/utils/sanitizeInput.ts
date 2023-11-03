import xss from "xss";

export function sanitize(value: any): any {
  if (typeof value === "string") {
    return xss(value);
  } else if (Array.isArray(value)) {
    return value.map((item) => sanitize(item));
  } else if (typeof value === "object" && value !== null) {
    const sanitizedObject: { [key: string]: any } = {};
    for (const key in value) {
      sanitizedObject[key] = sanitize(value[key]);
    }
    return sanitizedObject;
  }
  return value;
}
