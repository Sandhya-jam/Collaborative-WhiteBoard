import { useMemo} from "react";

const avatars=[
    "https://api.dicebear.com/7.x/bottts/svg?seed=1",
    "https://api.dicebear.com/7.x/bottts/svg?seed=2",
    "https://api.dicebear.com/7.x/bottts/svg?seed=3",
    "https://api.dicebear.com/7.x/bottts/svg?seed=4",
    "https://api.dicebear.com/7.x/bottts/svg?seed=5"
];

export default function useProfile() {

    const user = JSON.parse(localStorage.getItem("user"));

    const profile = useMemo(() => ({

        userId: user?._id,

        name: user?.name,

        email: user?.email,

        avatar:
            avatars[
                user
                    ? user.name.charCodeAt(0) % avatars.length
                    : 0
            ]

    }), [user]);
    return profile;
}