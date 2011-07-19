        

    // Class for dispatching events to other elements
    function dispatchEvent(from, type, iden) {
      if (from!='map') fireMapEvent(type, iden)
      if (from!='list') fireListEvent(type, iden)
      //if (from!='graph') fireGraphEvent(type, iden)
    }

