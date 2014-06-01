(function (exports) {
  var Title = React.createClass({
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
        <div>
          {title_desc[0]}
          <div className="description">{title_desc[1]}</div>
        </div>
      );
    }
  });

  var Item = React.createClass({
    getDefaultProps: function () {
      var props = {
        title: '',
        subtitles: []
      };
      return props;
    },
    render: function () {
      var subtitles = this.props.subtitles.map(function (s) {
        return <div className="subtitle"><Title title={s} /></div>;
      });
      var price = this.props.price;
      if (price) {
        price = (
          <div className="price">
            &euro;
            {price}
          </div>
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
        <div className={itemClasses.join(' ')}>
          <div className="title">
            <div><Title title={title} /></div>
            {subtitles}
          </div>
          {price}
        </div>
      );
    }
  });

  exports.cItem = Item;
}).call(this, window);
