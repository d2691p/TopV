var app = angular.module('topv', [ ]);

const API_KEY = 'AIzaSyDwtfXnk_ZPb73htuCztM0Jq9HKWJYT0Zc';
const SEARCH_CHANNEL_URL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel';		//requires &key, &q
const CHANNELS_DETAILS_URL = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails';			//requires &id
const PLAYLIST_ITEMS_URL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet';				//requires &playlistId
const VIDEO_DETAILS_URL = 'https://www.googleapis.com/youtube/v3/videos?part=statistics'; 		//requires &id 

app.controller("topVController", ['$http','$scope', function($http, $scope){
	
	$scope.channelIds = [];
	$scope.channelSnippets = [];
	$scope.uploadsid = "";
	$scope.videos = [];

	$scope.search = function (term) {
		$http.get(SEARCH_CHANNEL_URL + '&key=' + API_KEY + '&q=' + term)
			.success(function(data){
				var ytChannels = data.items;	//Get array of channels
				$scope.channelIds = _.pluck(ytChannels, 'id');		//Get only id, which contains channelId variable
				$scope.channelSnippets = _.pluck(ytChannels, 'snippet');

			})
			.error(function(){
				console.log("ERROR");
			});
	};

	$scope.getVideos = function(playlistId){
		$http.get(PLAYLIST_ITEMS_URL + '&key=' + API_KEY  + "&playlistId=" + playlistId + "&maxResults=50")
			.success(function (data){
				var videosArray = data.items;	
				$scope.videos = _.pluck(videosArray, 'snippet');
				console.log("playlistId: " + playlistId);

				angular.forEach($scope.videos, function(video){
					console.log("go for each");
					$scope.getVideoDetails(video);
					console.log($scope.videos);
				});
			})
			.error(function(data){
				console.log("ERROR");
			});


	};

	$scope.getChannelDetails = function(channelId){
		$http.get(CHANNELS_DETAILS_URL + '&key=' + API_KEY  + "&id=" + channelId)
			.success(function(data){
				$scope.uploadsId = data.items[0].contentDetails.relatedPlaylists.uploads;
				$scope.getVideos($scope.uploadsId);
			})
			.error(function(){
				console.log("ERROR");
			});
	};


	$scope.getVideoDetails = function(video){
		$scope.videoDetails = {};

		$http.get(VIDEO_DETAILS_URL + '&key=' + API_KEY + '&id=' + video.resourceId.videoId)
			.success(function(data){
				$scope.videoDetails = data.items[0].statistics;
				video.statistics = $scope.videoDetails;
				return video;
			})
			.error(function(){
				console.log("ERROR");
			});
	};

}]);

