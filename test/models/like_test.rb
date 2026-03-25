require "test_helper"

class LikeTest < ActiveSupport::TestCase
  test "normalizes visitor token before validation" do
    like = Like.create!(likeable: articles(:one), visitor_token: " Visitor-001 ")

    assert_equal "visitor-001", like.visitor_token
  end

  test "enforces unique visitor token per likeable" do
    Like.create!(likeable: articles(:one), visitor_token: "visitor-unique")

    duplicate = Like.new(likeable: articles(:one), visitor_token: "VISITOR-UNIQUE")

    assert_not duplicate.valid?
    assert duplicate.errors[:visitor_token].any?
  end
end
