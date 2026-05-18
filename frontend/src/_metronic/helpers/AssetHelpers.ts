import { useLayout } from "../layout/core";
import { ThemeModeComponent } from "../assets/ts/layout";
import { APP_BASE_PATH } from "@/shared/config/path.config";

/**
 * 將相對路徑轉換為絕對路徑
 * 使用統一的 base path 配置，確保與 vite.config.ts 中的設定一致
 * 
 * @param pathname - 相對路徑（例如：'media/logos/logo.svg'）
 * @returns 完整的絕對路徑（例如：'/xkBase/media/logos/logo.svg'）
 */
export const toAbsoluteUrl = (pathname: string) =>
  APP_BASE_PATH + pathname;

export const useIllustrationsPath = (illustrationName: string): string => {
  const { config } = useLayout();

  const extension = illustrationName.substring(
    illustrationName.lastIndexOf("."),
    illustrationName.length
  );
  const illustration =
    ThemeModeComponent.getMode() === "dark"
      ? `${illustrationName.substring(
          0,
          illustrationName.lastIndexOf(".")
        )}-dark`
      : illustrationName.substring(0, illustrationName.lastIndexOf("."));
  return toAbsoluteUrl(
    `media/illustrations/${config.illustrations?.set}/${illustration}${extension}`
  );
};
