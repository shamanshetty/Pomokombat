export const loadFromStorage = (key: string) => {
  try {
    const item = localStorage.getItem(`pomochamp_${key}`);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading ${key} from storage:`, error);
    return null;
  }
};

export const saveToStorage = (key: string, value: any) => {
  try {
    localStorage.setItem(`pomochamp_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};