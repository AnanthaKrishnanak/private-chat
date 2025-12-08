"use client";

import { useEffect, useState } from "react";
import { generateUserName } from "@/utils/generateUserName";

const USER_NAME_STORAGE_KEY = "user_name";

export const useUserName = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const existing = localStorage.getItem(USER_NAME_STORAGE_KEY);

    if (existing) {
      setUserName(existing);
      return;
    }

    const newUser = generateUserName();
    localStorage.setItem(USER_NAME_STORAGE_KEY, newUser);
    setUserName(newUser);
  }, []);

  return { userName };
};
