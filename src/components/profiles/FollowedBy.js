import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FollowButton } from "../PostInteraction/FollowUser"


export const FollowedBy = ({ selectedUserId, gastroUserObject, currentUsersFollows, fetchUsersFollows }) => {
    // Set a state variable for the user's follows
    const [profileOwnersFollowers, updateProfileOwnersFollowers] = useState([])

    // Define a function to fetch the selected users followers
    const fetchUsersFollowers = () => {
        fetch(`http://localhost:8088/follows?whoIsFollowed=${selectedUserId}&_expand=user`)
                .then(response => response.json())
                .then((followArrayWithUserObjectExpanded) => {
                    updateProfileOwnersFollowers(followArrayWithUserObjectExpanded)
                })
    }

    // Get the data for the current user with their follows embedded on initial render
    useEffect(
        () => {
            fetchUsersFollowers()
        },
        [selectedUserId] // 
    )
    return <>
        {
            profileOwnersFollowers.length > 0
                ? profileOwnersFollowers.map((followObj) => {
                    return <div key={`follower--${followObj.id}`} className="followedByListItem">
                              <div><Link to={`/userprofile/${followObj?.user?.id}`}>{followObj?.user?.name}</Link></div>
                              {
                                gastroUserObject.id !== followObj?.user?.id
                                && <FollowButton 
                                gastroUserObject={gastroUserObject}
                                userToFollowId={followObj?.user?.id}
                                usersFollows={currentUsersFollows}
                                fetchUsersFollows={fetchUsersFollows} />
                              }  
                           </div>
                })
                : <div>No followers currently</div>
        }
    </>
}