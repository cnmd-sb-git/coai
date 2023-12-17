export function setKey<T>(state: T, key: string, value: any): T {
  const segment = key.split(".");
  if (segment.length === 1) {
    return { ...state, [key]: value };
  } else if (segment.length > 1) {
    const [k, ...v] = segment;
    return { ...state, [k]: setKey(state[k as keyof T], v.join("."), value) };
  }

  // segment.length is zero
  throw new Error("invalid key");
}

export const formReducer = <T>() => {
  return (state: T, action: any) => {
    action.payload = action.payload ?? action.value;

    switch (action.type) {
      case "update":
        return { ...state, ...action.payload };
      case "reset":
        return { ...action.payload };
      case "set":
        return action.payload;
      default:
        if (action.type.startsWith("update:")) {
          const key = action.type.slice(7);
          return setKey(state, key, action.payload);
        }
    }
  };
};
