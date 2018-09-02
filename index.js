var app = new Vue({
    el: '#app',
    data: {
        apps: [],
        authors: authors
    },

    created: function() {
        this.fetchData()
        console.log(authors)
    },

    methods: {
        fetchData: function() {
            this.authors.forEach(author => {
                var xhr = new XMLHttpRequest()
                var self = this
                xhr.open('GET', "https://itunes.apple.com/lookup?id=" + author.artistId + "&entity=software&lang=zh-CN&country=CN")
                xhr.setRequestHeader("Access-Control-Allow-Origin", "*")
                xhr.onload = function() {
                    let results = JSON.parse(xhr.responseText).results
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
                }
                xhr.send()
            });
        },
        timeAgo: function(dateString) {
            return moment(dateString).fromNow()
        }
    }
});