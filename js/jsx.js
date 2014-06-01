/** @jsx React.DOM */
(function (exports) {
  var Title = React.createClass({displayName: 'Title',
    getDefaultProps: function () {
      var props = {
        title: ''
      };
    },
    getTitleDesc: function (str) {
      var title_desc = _.map(str.split(':'), function (x) {
        return x.trim();
      });
      return title_desc;
    },
    render: function () {
      var title_desc = this.getTitleDesc(this.props.title);
      return (
        React.DOM.div(null, 
          title_desc[0],
          React.DOM.div( {className:"description"}, title_desc[1])
        )
      );
    }
  });

  var Item = React.createClass({displayName: 'Item',
    getDefaultProps: function () {
      var props = {
        title: '',
        subtitles: []
      };
      return props;
    },
    render: function () {
      var subtitles = this.props.subtitles.map(function (s) {
        return React.DOM.div( {className:"subtitle"}, Title( {title:s} ));
      });
      var price = this.props.price;
      if (price) {
        price = (
          React.DOM.div( {className:"price"}, 
            "€",
            price
          )
        );
      }
      var title = this.props.title;
      var itemClasses = ['item'];
      if (title.length === 0) {
        itemClasses.push('empty');
      } else if (title.charAt(0) === '!') {
        itemClasses.push('heading');
        title = title.substr(1);
      }
      return (
        React.DOM.div( {className:itemClasses.join(' ')}, 
          React.DOM.div( {className:"title"}, 
            React.DOM.div(null, Title( {title:title} )),
            subtitles
          ),
          price
        )
      );
    }
  });

  exports.cItem = Item;
}).call(this, window);

/** @jsx React.DOM */
(function (exports) {
  var Items = React.createClass({displayName: 'Items',
    getDefaultProps: function () {
      return { items: [] };
    },
    render: function () {
      var self = this;
      var items = this.props.items.map(function (item) {
        var itm = cItem(item);
        return React.DOM.li(null, itm);
      });
      return (
        React.DOM.ul( {className:"items"}, 
          items
        )
      );
    }
  });
  exports.cItems = Items;
}).call(this, window);

/** @jsx React.DOM */
(function (exports) {
  
  var MenuList = React.createClass({displayName: 'MenuList',
    getDefaultProps: function () {
      var props = {
        languages: ['ru', 'en'],
        primary: 'lt',
        docid: null,
        sheet: 'menu',
        format: 'date',
        orderby: null
      };
      return props;
    },
    getInitialState: function () {
      return { items: [] };
    },
    componentDidMount: function () {
      var self           = this;
      var langs          = this.props.languages;
      var primaryLang    = this.props.primary;
      var secondaryLangs = _.filter(langs, function (lang) {
        return lang !== primaryLang;
      });
      var orderedLangs = [primaryLang].concat(secondaryLangs);

      Tabletop.init({
        key: this.props.docid,
        wanted: [this.props.sheet],
        orderby: this.props.orderby,
        simpleSheet: true,
        postProcess: function (row) {
          if (row.price) {
            row.price = parseFloat(row.price).toFixed(2);
          }
          row.title = row[primaryLang];
          row.subtitles = _.map(secondaryLangs,
                                function (lang) {
                                  return row[lang];
                                });
        },
        callback: function (data) {
          if (self.props.format === 'date') {
            data = _.filter(data, function (item) {
              return moment().isBefore(moment(item.date, "DD/MM/YYYY"));
            });
          }
          data = _.groupBy(data, function (item) {
            return item.date;
          });
          if (self.props.format === 'date') {
            var days  = _.keys(data);
            _.each(days, function (day) {
              var m = moment(day, "DD/MM/YYYY");
              day = data[day];
              day.heading = _.map(orderedLangs, function (lang) {
                return m.lang(lang).format('dddd').toUpperCase();
              }).join(' - ');
              day.day = _.map(orderedLangs, function (lang) {
                return m.lang(lang).format('D MMMM');
              }).join(' - ');
            });
          } else {
            _.each(days, function (day) {
              data[day].heading = day;
            });
          }
          self.setState({ items: data });
        }
      });
    },
    render: function () {
      var self = this;
      var items = this.state.items;
      var days = _.keys(items);
      var jsxDays = _.map(days, function (day) {
        day = items[day];
        return (
          React.DOM.div( {className:"day"}, 
            React.DOM.h3(null, day.heading),
            React.DOM.h4(null, day.day),
            cItems( {items:day} )
          )
        );
      });
      return React.DOM.div(null, jsxDays);
    }
  });

  exports.cMenuList = MenuList;
}).call(this, this);


