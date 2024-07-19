import BaseAPI from "./BaseAPI";
import Client from "../Client";
import { EnumUserPresence } from "../../interfaces/GeneralInterfaces";

export type GetUserProfileHeaderOptions = {
    userId: number;
}
export type GetUserProfileHeader = {
    UserId: number;
    ProfileUserId: number;
    ProfileUserName: string;
    ProfileDisplayName: string;
    FriendsCount: number;
    UserPresenceType: EnumUserPresence;
    LastLocation: string | null;
    UserStatus: string | null;
    UserStatusDate: string | null;
    UserPlaceId: number | null;
    FollowersCount: number;
    FollowingsCount: number;
    IsVieweeBlocked: boolean;
    IsViewerBlocked: boolean;
    AreFriends: boolean;
    IncomingFriendRequestPending: boolean;
    MaySendFriendInvitation: boolean;
    FriendRequestPending: boolean;
    MayFollow: boolean;
    IsFollowing: boolean;
    CanMessage: boolean;
    MessagesDisabled: boolean;
    CanBeFollowed: boolean;
    CanTrade: boolean;
    CanSeeFavorites: boolean;
    MayImpersonate: boolean;
    MayEdit: boolean;
    HeadShotImage: {
        Final: boolean;
        Url: string;
        RetryUrl: string | null;
        UserId: number;
        EndpointType: "Avatar" | string;
    };
    PreviousUserNames: string;
    IsUserOnPhone: boolean;
    CanSeeInventory: boolean;
}

export default class OtherAPI extends BaseAPI {
    constructor (client: Client) {
        super({
            client,
            baseUrl: "https://roblox.com/"
        });
    }

    getUserProfileHeader (options: GetUserProfileHeaderOptions): Promise<GetUserProfileHeader> {
        let baseData = {
            UserId: 0,
            ProfileUserId: 0,
            ProfileUserName: "",
            ProfileDisplayName: "",
            FriendsCount: 0,
            UserPresenceType: 0,
            LastLocation: "",
            UserStatus: null,
            UserStatusDate: null,
            UserPlaceId: null,
            FollowersCount: 0,
            FollowingsCount: 0,
            IsVieweeBlocked: false,
            IsViewerBlocked: false,
            AreFriends: false,
            IncomingFriendRequestPending: false,
            MaySendFriendInvitation: false,
            FriendRequestPending: false,
            MayFollow: false,
            IsFollowing: false,
            CanMessage: true,
            MessagesDisabled: false,
            CanBeFollowed: false,
            CanTrade: false,
            CanSeeFavorites: true,
            MayImpersonate: false,
            MayEdit: false,
            HeadShotImage: {
              Final: true,
              Url: "",
              RetryUrl: null,
              UserId: 0,
              EndpointType: "Avatar"
            },
            PreviousUserNames: "",
            IsUserOnPhone: false,
            CanSeeInventory: true
          }
        const userData = new Promise<GetUserProfileHeader>((resolve, reject) => {
            try {
                // User Data
                this.request({requiresAuth: false, request: {url: `https://users.roblox.com/v1/users/${options.userId}`},  json: true}).then(response => {
                    let data = response.body
                    baseData.ProfileUserId = data.id
                    baseData.ProfileUserName = data.name
                    baseData.ProfileDisplayName = data.displayName
                });
                // User Friend Count
                this.request({requiresAuth: false, request: {url: `https://friends.roblox.com/v1/users/${options.userId}/friends/count`},  json: true}).then(response => {
                    let data = response.body
                    baseData.FriendsCount = data.count
                });
                // User Followings Count
                this.request({requiresAuth: false, request: {url: `https://friends.roblox.com/v1/users/${options.userId}/followings/count`},  json: true}).then(response => {
                    let data = response.body
                    baseData.FollowingsCount = data.count
                });
                // User Followers Count
                this.request({requiresAuth: false, request: {url: `https://friends.roblox.com/v1/users/${options.userId}/followers/count`},  json: true}).then(response => {
                    let data = response.body
                    baseData.FollowersCount = data.count
                });
                // User Presense Info
                this.request({requiresAuth: false, request: {url: `https://presence.roblox.com/v1/presence/users`, method: 'POST', body: `{"userIds": [${options.userId}]}`},  json: true}).then(response => {
                    let data = response.body.userPresences[0]
                    baseData.UserPresenceType = data.userPrecenceType
                    baseData.LastLocation = data.lastLocation
                    baseData.UserPlaceId = data.placeId
                });
                // User Headshot Info
                this.request({requiresAuth: false, request: {url: `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${options.userId}&size=420x420&format=Png&isCircular=false`},  json: true}).then(response => {
                    let data = response.body.data[0]
                    baseData.HeadShotImage.Url = data.imageUrl
                    baseData.HeadShotImage.UserId = data.targetId
                });
                resolve(baseData)
            } catch (error) {
                reject(error)
            }
        }) 

        return userData
    }
}
