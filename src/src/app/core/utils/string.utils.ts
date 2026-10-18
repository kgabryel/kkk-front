export class StringUtils {
  public static clearPolishCharacters(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  public static compareString(a: string, b: string): number {
    return a.toLowerCase().localeCompare(b.toLowerCase());
  }

  public static stringIncludes(a: string, b: string): boolean {
    return StringUtils.clearPolishCharacters(a)
      .toLowerCase()
      .includes(StringUtils.clearPolishCharacters(b).toLowerCase());
  }
}
