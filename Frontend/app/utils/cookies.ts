
export const GAME_CODE_COOKIE = 'game_code';
export const USERNAME_COOKIE = 'username';

export function setGameCodeCookie(gameCode: string) {
    document.cookie = `${GAME_CODE_COOKIE}=${gameCode}; path=/; max-age=3600; SameSite=Strict`;
}

export function getGameCodeFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    const gameCookie = cookies.find(cookie => cookie.trim().startsWith(`${GAME_CODE_COOKIE}=`));
    return gameCookie ? gameCookie.split('=')[1] : null;
}

export function setUsernameCookie(username: string) {
    document.cookie = `${USERNAME_COOKIE}=${username}; path=/; max-age=3600; SameSite=Strict`;
}

export function getUsernameFromCookie(): string | null {
    const cookies = document.cookie.split(';');
    const usernameCookie = cookies.find(cookie => cookie.trim().startsWith(`${USERNAME_COOKIE}=`));
    return usernameCookie ? usernameCookie.split('=')[1] : null;
}

export function clearGameCodeCookie() {
    document.cookie = `${GAME_CODE_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function clearUsernameCookie() {
    document.cookie = `${USERNAME_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
} 