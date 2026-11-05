// The admin's selected project, kept across admin pages. Firestore map keys have no stable order,
// so without this the tracker could reopen on a different project each time.
const SELECTED_PROJECT_KEY = "as-salsabil-admin-project";

export const readSelectedProject = () => {
  try {
    return window.localStorage.getItem(SELECTED_PROJECT_KEY);
  } catch {
    return null;
  }
};

export const saveSelectedProject = (project: string) => {
  try {
    window.localStorage.setItem(SELECTED_PROJECT_KEY, project);
  } catch {
    // Storage unavailable — the project just won't be remembered.
  }
};
