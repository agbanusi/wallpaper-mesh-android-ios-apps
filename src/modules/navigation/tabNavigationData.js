import FavScreen from '../favorites/FavViewContainer';
import CalendarScreen from '../calendar/CalendarViewContainer';
import RatedScreen from '../toprated/RatedViewContainer';
import GenScreen from '../generate/GenViewContainer';

const iconHome = require('../../../assets/images/tabbar/home.png');
const iconGrids = require('../../../assets/images/tabbar/grids.png');
const iconPages = require('../../../assets/images/tabbar/pages.png');
const iconRated = require('../../../assets/images/pages/chart.png');
// const iconComponents = require('../../../assets/images/tabbar/components.png');

const tabNavigationData = [
  {
    name: 'Generate',
    component: CalendarScreen,
    icon: iconHome,
  },
  {
    name: 'Variations',
    component: GenScreen,
    icon: iconPages,
  },
  {
    name: 'Latest',
    component: RatedScreen,
    icon: iconRated,
  },
  {
    name: 'History',
    component: FavScreen,
    icon: iconGrids,
  },
];

export default tabNavigationData;
