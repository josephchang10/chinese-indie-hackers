var app = new Vue({
    el: '#app',
    data: {
        apps: [],
        authors: authors,
        selectedAuthor: null,
        loadedAuthorNumber: 0
    },

    created: function() {
        this.fetchData()
    },

    filters: {
        getContact: function(author) {
            if (author.weibo != null) {
                return author.weibo
            } else if (author.github != null) {
                return author.github
            } else {
                return author.website
            }
        }
    },

    methods: {
        fetchData: function() {
            this.authors.forEach(author => {
                var self = this
                this.$http.jsonp("https://itunes.apple.com/lookup?id=" + author.artistId + "&entity=software&lang=zh-CN&country=CN").then(response => {
                    var results = response.body.results
                    results.shift()
                    results = results.filter(app => app.artistId == author.artistId)
                    self.apps = self.apps.concat(results)
                    console.log(self.apps.length)
                    this.loadedAuthorNumber++
                    if (this.loadedAuthorNumber === this.authors.length) {
                        self.apps.sort(function(a, b){
                            var dateA = new Date(a.currentVersionReleaseDate)
                            var dateB = new Date(b.currentVersionReleaseDate)
                            if (dateA < dateB) {
                                return 1
                            }
                            if (dateA > dateB) {
                                return -1
                            }
                            return 0
                        })
                    }
                })
            });
        },
        timeAgo: function(dateString) {
            return moment(dateString).fromNow()
        },
        isNewlyLaunched: function(item) {
            return (moment().diff(moment(item.releaseDate), 'days') <= 30)
        },
        getAuthorAverageRate: function(author) {
            var totalRate = 0
            var totalNumber = 0
            this.apps.filter(app => app.artistId == author.artistId).forEach(function (app, index, array){
                if (app.userRatingCount && app.averageUserRating) {
                    totalRate += app.userRatingCount * app.averageUserRating
                    totalNumber += app.userRatingCount
                }
            })
            return (totalRate/totalNumber).toFixed(2)
        },
        getAuthorRatesNumber: function(author) {
            var totalNumber = 0
            this.apps.filter(app => app.artistId == author.artistId).forEach(function (app, index, array){
                if (app.userRatingCount) {
                    totalNumber += app.userRatingCount
                }
            })
            return totalNumber
        }
    }
});