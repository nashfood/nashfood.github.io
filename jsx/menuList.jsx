(function (exports) {
  
  var MenuList = React.createClass({
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
          <div className="day">
            <h3>{day.heading}</h3>
            <h4>{day.day}</h4>
            <cItems items={day} />
          </div>
        );
      });
      return <div>{jsxDays}</div>;
    }
  });

  exports.cMenuList = MenuList;
}).call(this, this);


