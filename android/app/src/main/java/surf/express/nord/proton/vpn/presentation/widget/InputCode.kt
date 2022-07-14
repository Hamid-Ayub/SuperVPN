package surf.express.nord.proton.vpn.presentation.widget

import android.content.Context
import android.util.AttributeSet
import android.view.View
import android.widget.LinearLayout
import surf.express.nord.proton.vpn.R
import surf.express.nord.proton.vpn.databinding.ViewInputCodeBinding

class InputCode(context: Context, attrs: AttributeSet?) : LinearLayout(context, attrs) {
    private var binding: ViewInputCodeBinding

    var error: Boolean = false
        set(value) {
            field = value
            post {
                refreshDrawableState()
            }
        }

    init {
        val view = View.inflate(context, R.layout.view_input_code, this)
        binding = ViewInputCodeBinding.bind(view)
    }

    override fun onCreateDrawableState(extraSpace: Int): IntArray {
        val drawableState = super.onCreateDrawableState(extraSpace + 1)

        if (error) {
            View.mergeDrawableStates(
                drawableState,
                surf.express.nord.proton.vpn.presentation.widget.InputViewConstant.STATE_ERROR
            )
        }

        return drawableState
    }

    fun setText(text: String) {
        binding.tvNumber.text = text
    }
}