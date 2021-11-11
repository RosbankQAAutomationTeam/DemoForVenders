export type page = "Главная" | "Регистрация" | "Продукт";

export const countries = [
  "",
  "Индия",
  "Филлипины",
  "Боливия",
  "Уругвай",
  "Австралия",
  "Ангола"
] as const;

export type country = typeof countries[number];

export type userInfo = {
  name: string;
  sessionIds: string[];
  uid: string;
  password: string;
  country: country;
};

const userInfos: userInfo[] = [];

userInfos.push({
  name: "Тест",
  sessionIds: ["#"],
  uid: "Test#",
  password: "password#",
  country: "Страна#"
});

export function getUserInfo({
  uid = undefined,
  sessionId = undefined,
  password = undefined
}: {
  uid?: string;
  sessionId?: string;
  password?: string;
}) {
  if (sessionId) {
    const result = userInfos.find((info) =>
      info.sessionIds.find((id) => id === sessionId)
    );
    if (result) {
      return result;
    }
  }
  if (!uid) {
    return undefined;
  }
  const result = userInfos.find((info) => info.uid === uid);
  return result;
}

export function addUser(userInfo: userInfo) {
  console.log(JSON.stringify(userInfo));
  if (getUserInfo(userInfo)) {
    alert("User already exists");
    return false;
  }
  userInfos.push(userInfo);
  return true;
}

export const failOptions = [
  ["", "Ошибка регистрации клиента"],
  ["", "Поле {страна} при регистрации не работает"],
  ["", "Вечная загрузка страницы продукта"]
];
