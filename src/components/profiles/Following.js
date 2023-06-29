import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FollowButton } from "../PostInteraction/FollowUser"


export const Following = ({ followArray, updateFollowArray, gastroUserObject, currentUsersFollows, fetchUsersFollows }) => {
    // Set a state variable for the all users
    const [allUsers, setAllUsers] = useState([])
    const [usersFollowed, updateUsersFollowed] = useState([])

    // Define a function to fetch the all users
    const fetchAllUsers = () => {
        fetch(`http://localhost:8088/users`)
                .then(response => response.json())
                .then((userArray) => {
                    setAllUsers(userArray)
                })
    }

    // Get the data for the all users on initial render
    useEffect(
        () => {
            fetchAllUsers()
        },
        [] // 
    )

    // Find the users who the selected user is following
    useEffect(
        () => {
            if (followArray) {
                const usersBeingFollowed = allUsers.filter(userObj => followArray.some(follow => follow.whoIsFollowed === userObj.id))
                updateUsersFollowed(usersBeingFollowed)
            }
        },
        [allUsers, followArray] 
    )

    return <>
    {
        usersFollowed.length > 0
            ? usersFollowed.map((followObj) => {
                return <div key={`beingFollowed--${followObj.id}`}>
                          <div><Link to={`/userprofile/${followObj?.id}`}>{followObj?.name}</Link></div>
                          {
                            gastroUserObject.id !== followObj?.id
                            && <FollowButton 
                            gastroUserObject={gastroUserObject}
                            userToFollowId={followObj?.id}
                            usersFollows={currentUsersFollows}
                            fetchUsersFollows={fetchUsersFollows}
                            updateProfileFollowList={updateFollowArray} />
                          }  
                       </div>
            })
            : <div>Currently not following any users</div>
    }
    </>
}