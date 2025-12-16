import { useEffect, useState } from 'react';
type UserInfo = any;

const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const getUserInfoFromLocalStorage = () => {
    const storedUserInfo = localStorage.getItem('authUser'); // ✅ Fixed key
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo); // ✅ Removed optional chaining
        if (parsedUserInfo) {
          setUserInfo(parsedUserInfo);
          setUserId(parsedUserInfo.id); // Assuming the user object has an 'id' property
        }
      } catch (error) {
        // console.error("Failed to parse authUser:", error);
      }
    }
  };

  useEffect(() => {
    getUserInfoFromLocalStorage();
  }, []);

  return { userInfo, userId };
};

export default useUserInfo;
