class HomeController < ApplicationController
  layout 'base'
  def index

  end

  def search
    words = params[:keywords]
    page = params[:page]

    index = 'Books'
    query = @request.item_search(
      query: {
        'SearchIndex' => index,
        'Keywords' => words,
        'ItemPage' => page,
        'ResponseGroup' => 'Images, ItemAttributes, OfferFull'
        }
      )
    render :json =>{:data => Hash.from_xml(query.body)}
  end
end
