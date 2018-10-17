update table --> colum for image
user route --> user info --> query to get the info

3 components: app, uploader, profilepic

app should get first last id profpic as soon as user enters page (component mounts)
--> values from the session ?


- - - - - - - - - - - - - - -

<Route path="/" component={Profile} />
<Route path="/user:id" component={OtherProfile} />
- - - - -
componentDidMount(){ // --> to get info from the server
    axios.get('/get-user/2')
}
- - - - -
app.get('/get-user/:id', (req, res) => {

    db.blablablab() -->

    res.json(allTheOtherUserInfo);

    redirect --> redirect to "/" using this.props.history.push('/');
})

"localhost:8080/user/2" --> redirect to "/" using this.props.history.push('/');

// react passes 2 PROPS it renders --> HISTORY & MATCH --> {Objects}

// recycle the OtherProfile component so RR will not rerender

- - - - - - - - -

let buttonText = 'Make Friend Request';
if (data) {
    if (data.status == 2){
        buttonText = 'End Friendship'
    } else if (data.status == 1) {
        if (this.props.otherUserId != data.receiver_id){
            buttonText = 'Accept Friendship'
        }
    }
}

<FriendButton />

- - - - - - - - -

    1. because the status is undefined, we need to reflect // inside of componentDidMount, in the then() of
    that in the component state. we do that by setting state // the axios.get

    if (theStatusIsUndefinedOrNullOrSomething) {
       this.setState({
           status: whateverTheStatusShouldBe
       })
    }

    2. When we SEND a friend req (aka when we click the btn),
    we need to look at what the previous status was to know what the next one
    should be

    if status is 1 and they click the button, the status
    should change to pending

    that means that, in your POST req, you need to send the
    new status, to be updated axios.post(‘/update-friends’, {
        newStatus: whateverTheNewStatusShouldBe,
        otherUserId: theOtherUserId
    })

    3. in the app.post for the friend request, update
       the DB with the senderID, receiverID,
       and the new status
       the IDs come from req.session and otherUserId

- - - - - - - - - - - - - -

export function doSomething() {
    return axios.post('/something').then(
        () => {
            return: {
                Type: something
            }
    })
}

function mapStateToProps(){
    return {
        friends: state.friendsWannabes && state.friendsWannabes.filter(
            user => user.status == 2
        ),
        wannabes: state.friendsWannabes && state.friendsWannabes.filter(
            user => user.status == 1
        )
    }
}

render(){
    return (
        <div>
            {this.wannabes.map(
                wannabes => (
                    <div key={wannabe.id}>
                        {wannabe.first} {wannabe.last}
                    </div>
                )
            )}
        </div>
    )
}

- - - - - - - - - -

SET & MAP

var mySet = new Set()

mySet.add(10)
mySet.add(11)
mySet.add(['dogs', 'cats'])

mySet.add(10)

mySet.size

console.log(mySet.size);

- - - - - - - - - - -

// Generator function creates a function that you can pick up (call) whenever

function* gen(){
    return 10;
}

console.log(
    gen().next()
);

var iterator = gen();

console.log(interator.next());

setTimeout(function(){
    console.log(
        interator.next()
    );
    setTimeout(function(){
        console.log(
            interator.next()
        );
    }, 1000);
}, 1000);
