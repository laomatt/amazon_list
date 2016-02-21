class HomeController < ApplicationController
  layout 'base'
  def index

  end

  def search
    words = params[:search][:keywords]
    if params[:page]
      page = params[:page]
    else
      page = "1"
    end

    index = 'Books'
    query = @request.item_search(
      query: {
        'SearchIndex' => index,
        'Keywords' => words,
        'ItemPage' => '1',
        'ResponseGroup' => 'Images, ItemAttributes, OfferFull'
        }
      )

    doc = Nokogiri::XML(query.body)
    render :json =>{:data => Hash.from_xml(query.body)}
  end
end
