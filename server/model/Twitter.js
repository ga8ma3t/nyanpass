const endpoint = 'https://api.twitter.com/1.1/followers/list.json'

function fetchFollowers() {
  request.get(`${endpoint}?screen_name=nanocloudx&skip_status=true&include_user_entities=false`)
}
