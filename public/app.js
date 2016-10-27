var app = angular.module('topv', [ ]);

const API_KEY = 'AIzaSyDwtfXnk_ZPb73htuCztM0Jq9HKWJYT0Zc';
const SEARCH_CHANNEL_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel';		//requires &key, &q
const CHANNELS_DETAILS_URL = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails';			//requires &id
const PLAYLIST_ITEMS_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet';				//requires &playlistId


app.controller("topVController", ['$http','$scope', function($http, $scope){
	
	$scope.channelIds = [];
	$scope.uploadsid = "";
	$scope.videos = [];

	$scope.search = function (term) {
		$http.get(SEARCH_CHANNEL_URL + '&key=' + API_KEY + '&q=' + term)
			.success(function(data){
				var ytChannels = data.items;	//Get array of channels
				$scope.channelIds = _.pluck(ytChannels, 'id');		//Get only id, which contains channelId variable
				getChannelDetails($scope.channelIds[0].channelId);
			})
			.error(function(){
				console.log("ERROR");
			});
	};

	function getChannelDetails(channelId){
		$http.get(CHANNELS_DETAILS_URL + '&key=' + API_KEY  + "&id=" + channelId)
			.success(function(data){
				$scope.uploadsId = data.items[0].contentDetails.relatedPlaylists.uploads;
				getVideos($scope.uploadsId);
			})
			.error(function(){
				console.log("ERROR");
			});
	};

	function getVideos(playlistId){
		$http.get(PLAYLIST_ITEMS_URL + '&key=' + API_KEY  + "&playlistId=" + playlistId + "&maxResults=50")
			.success(function (data){
				var videosArray = data.items;	
			$scope.videos = _.pluck(videosArray, 'snippet');
				console.log($scope.videos);
			})
			.error(function(data){
				console.log("ERROR");
			});
	};


}]);