import { BrowserWindow, ipcMain, Menu, shell, app, MenuItemConstructorOptions } from "electron";
import Store from "electron-store";
import { KitStore } from "./store.js";
const store = new Store<KitStore>();

function template(win: BrowserWindow, isProject: boolean): MenuItemConstructorOptions[] {
  const isMac = process.platform === "darwin";
  return [
    ...((isMac
      ? [
          {
            label: "كِت",
            submenu: [{ role: "services" }, { type: "separator" }, { role: "hide" }, { role: "hideothers" }, { role: "unhide" }, { type: "separator" }, { role: "quit" }]
          }
        ]
      : []) as MenuItemConstructorOptions[]),
    {
      label: "المشروع",
      submenu: [
        {
          label: "فتح مشروع...",
          accelerator: "CmdOrCtrl+O",
          click() {
            win.webContents.send("openDialog");
          }
        },
        {
          label: "فتح حديث",
          submenu: [
            {
              label: "اختبار هنا"
            }
          ]
        },
        {
          label: "إعادة تحميل المشروع",
          click() {
            win.webContents.send("reloadProject");
          },
          enabled: isProject
        },
        {
          label: "إغلاق المشروع",
          click() {
            win.webContents.send("closeProject");
          },
          enabled: isProject
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" }
      ]
    },
    {
      label: "لارافيل",
      submenu: [
        {
          label: "تنكر الآن",
          accelerator: "CmdOrCtrl+Enter",
          click() {
            win.webContents.send("executeTinker");
          },
          enabled: isProject
        }
      ]
    },
    {
      label: "تحرير",
      submenu: [{ role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" }]
    },
    {
      label: "عرض",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    {
      label: "نافذة",
      submenu: [{ role: "minimize" }, ...((isMac ? [{ type: "separator" }, { role: "front" }, { type: "separator" }, { role: "window" }] : [{ role: "close" }]) as MenuItemConstructorOptions[])]
    },
    {
      role: "help",
      submenu: [
        {
          label: "الويكي",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/wiki");
          }
        },
        {
          label: "الإبلاغ عن مشكلة",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/issues/new");
          }
        },
        {
          label: "الإصدارات",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/releases");
          }
        },
        {
          label: "الترخيص",
          click() {
            openLink("https://github.com/tmdh/laravel-kit/blob/master/license.txt");
          }
        },
        {
          label: "لارافيل كِت على جيت هاب",
          click() {
            openLink("https://github.com/tmdh/laravel-kit");
          }
        },
        {
          label: "موقع لارافيل كِت",
          click() {
            openLink("https://tmdh.github.io/laravel-kit");
          }
        },
        {
          label: `إصدار التطبيق: ${app.getVersion()}`,
          enabled: false
        }
      ]
    }
  ];
}

ipcMain.on("buildMenu", async (e, isProject) => {
  await buildMenu(BrowserWindow.getAllWindows()[0], isProject);
});

function openLink(link: string) {
  shell.openExternal(link);
}

async function buildMenu(win: BrowserWindow, isProject: boolean) {
  let newTemplate = template(win, isProject);
  const isMac = process.platform === "darwin";
  const recents = store.get("recents").map((dir) =>
    Object.assign({
      label: dir,
      click() {
        win.webContents.send("openProject", dir);
      }
    })
  );
  const extraMenus = [
    { type: "separator" },
    {
      label: "مسح المفتوحة مؤخراً",
      click() {
        win.webContents.send("clearRecents");
      }
    }
  ];
  let recentsMenu = Object.assign({ label: "فتح حديث", submenu: [...recents, ...extraMenus] });
  (newTemplate[isMac ? 1 : 0].submenu as MenuItemConstructorOptions[])[1] = recentsMenu;
  Menu.setApplicationMenu(Menu.buildFromTemplate(newTemplate));
}

export default async function (win: BrowserWindow): Promise<void> {
  const menu = Menu.buildFromTemplate(template(win, false));
  Menu.setApplicationMenu(menu);
  await buildMenu(win, false);
}
