var app = new Vue({
    el: '#app',
    data: {
        apps: [],
        authors: authors
    },

    created: function() {
        this.fetchData()
    },

    methods: {
        fetchData: function() {
            this.authors.forEach(author => {
                var self = this
                this.$http.jsonp("https://itunes.apple.com/lookup?id=" + author.artistId + "&entity=software&lang=zh-CN&country=CN").then(response => {
                    let results = response.body.results
                    results.shift()
                    self.apps = self.apps.concat(results)
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
                })
            });
        },
        timeAgo: function(dateString) {
            return moment(dateString).fromNow()
        }
    }
});