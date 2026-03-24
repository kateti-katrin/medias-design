class ServicesController < ApplicationController
  def index
    @services = Service.order(:id)
  end

  def show
    @service = Service.find(params[:id])
  end

  def brief
  end

  def calculator
  end
end
